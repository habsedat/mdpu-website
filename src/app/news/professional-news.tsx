'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsPost } from '@/types/firestore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Tag, User, Play, ArrowRight, X, Search, MapPin, ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import VideoPlayer from "@/components/ui/custom/VideoPlayer";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfessionalNews() {
  const [newsItems, setNewsItems] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNews, setSelectedNews] = useState<NewsPost | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPublicNews();
  }, []);

  const loadPublicNews = async () => {
    try {
      console.log('Loading public news...');
      
      const newsQuery = query(collection(db, 'news'));
      const newsSnapshot = await getDocs(newsQuery);
      const allNewsData = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsPost[];
      
      // Filter for published news and sort client-side
      const publishedNews = allNewsData
        .filter(news => news.status === 'published')
        .sort((a, b) => {
          const aTime = a.publishedAt?.toMillis() || a.createdAt.toMillis();
          const bTime = b.publishedAt?.toMillis() || b.createdAt.toMillis();
          return bTime - aTime;
        });
      
      console.log('Public news loaded:', publishedNews.length);
      setNewsItems(publishedNews);
    } catch (error) {
      console.error('Error loading public news:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (newsId: string) => {
    try {
      await updateDoc(doc(db, 'news', newsId), {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleEngagement = async (newsId: string, type: 'like' | 'dislike' | 'love', currentNews: NewsPost) => {
    if (!user) {
      alert('Please sign in to interact with posts');
      return;
    }

    try {
      const newsRef = doc(db, 'news', newsId);
      const userId = user.uid;
      
      // Get current engagement status
      const isLiked = currentNews.likedBy?.includes(userId) || false;
      const isDisliked = currentNews.dislikedBy?.includes(userId) || false;
      const isLoved = currentNews.lovedBy?.includes(userId) || false;

      // Prepare update object
      const updates: any = {};

      if (type === 'like') {
        if (isLiked) {
          // Remove like
          updates.likes = increment(-1);
          updates.likedBy = arrayRemove(userId);
        } else {
          // Add like and remove other reactions
          updates.likes = increment(1);
          updates.likedBy = arrayUnion(userId);
          
          if (isDisliked) {
            updates.dislikes = increment(-1);
            updates.dislikedBy = arrayRemove(userId);
          }
          if (isLoved) {
            updates.loves = increment(-1);
            updates.lovedBy = arrayRemove(userId);
          }
        }
      } else if (type === 'dislike') {
        if (isDisliked) {
          // Remove dislike
          updates.dislikes = increment(-1);
          updates.dislikedBy = arrayRemove(userId);
        } else {
          // Add dislike and remove other reactions
          updates.dislikes = increment(1);
          updates.dislikedBy = arrayUnion(userId);
          
          if (isLiked) {
            updates.likes = increment(-1);
            updates.likedBy = arrayRemove(userId);
          }
          if (isLoved) {
            updates.loves = increment(-1);
            updates.lovedBy = arrayRemove(userId);
          }
        }
      } else if (type === 'love') {
        if (isLoved) {
          // Remove love
          updates.loves = increment(-1);
          updates.lovedBy = arrayRemove(userId);
        } else {
          // Add love and remove other reactions
          updates.loves = increment(1);
          updates.lovedBy = arrayUnion(userId);
          
          if (isLiked) {
            updates.likes = increment(-1);
            updates.likedBy = arrayRemove(userId);
          }
          if (isDisliked) {
            updates.dislikes = increment(-1);
            updates.dislikedBy = arrayRemove(userId);
          }
        }
      }

      await updateDoc(newsRef, updates);
      
      // Update local state
      setNewsItems(prev => prev.map(news => {
        if (news.id === newsId) {
          const updated = { ...news };
          
          if (type === 'like') {
            if (isLiked) {
              updated.likes = (updated.likes || 0) - 1;
              updated.likedBy = updated.likedBy?.filter(id => id !== userId) || [];
            } else {
              updated.likes = (updated.likes || 0) + 1;
              updated.likedBy = [...(updated.likedBy || []), userId];
              
              if (isDisliked) {
                updated.dislikes = Math.max(0, (updated.dislikes || 0) - 1);
                updated.dislikedBy = updated.dislikedBy?.filter(id => id !== userId) || [];
              }
              if (isLoved) {
                updated.loves = Math.max(0, (updated.loves || 0) - 1);
                updated.lovedBy = updated.lovedBy?.filter(id => id !== userId) || [];
              }
            }
          } else if (type === 'dislike') {
            if (isDisliked) {
              updated.dislikes = Math.max(0, (updated.dislikes || 0) - 1);
              updated.dislikedBy = updated.dislikedBy?.filter(id => id !== userId) || [];
            } else {
              updated.dislikes = (updated.dislikes || 0) + 1;
              updated.dislikedBy = [...(updated.dislikedBy || []), userId];
              
              if (isLiked) {
                updated.likes = Math.max(0, (updated.likes || 0) - 1);
                updated.likedBy = updated.likedBy?.filter(id => id !== userId) || [];
              }
              if (isLoved) {
                updated.loves = Math.max(0, (updated.loves || 0) - 1);
                updated.lovedBy = updated.lovedBy?.filter(id => id !== userId) || [];
              }
            }
          } else if (type === 'love') {
            if (isLoved) {
              updated.loves = Math.max(0, (updated.loves || 0) - 1);
              updated.lovedBy = updated.lovedBy?.filter(id => id !== userId) || [];
            } else {
              updated.loves = (updated.loves || 0) + 1;
              updated.lovedBy = [...(updated.lovedBy || []), userId];
              
              if (isLiked) {
                updated.likes = Math.max(0, (updated.likes || 0) - 1);
                updated.likedBy = updated.likedBy?.filter(id => id !== userId) || [];
              }
              if (isDisliked) {
                updated.dislikes = Math.max(0, (updated.dislikes || 0) - 1);
                updated.dislikedBy = updated.dislikedBy?.filter(id => id !== userId) || [];
              }
            }
          }
          
          // Also update selectedNews if it matches
          if (selectedNews && selectedNews.id === newsId) {
            setSelectedNews(updated);
          }
          
          return updated;
        }
        return news;
      }));

    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const handleReadMore = (news: NewsPost) => {
    setSelectedNews(news);
    if (news.id) {
      incrementViews(news.id);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      development: 'bg-emerald-500 text-white',
      events: 'bg-blue-500 text-white',
      entertainment: 'bg-purple-500 text-white',
      community: 'bg-orange-500 text-white',
      announcements: 'bg-red-500 text-white',
      culture: 'bg-yellow-500 text-white',
      education: 'bg-indigo-500 text-white',
      health: 'bg-pink-500 text-white',
      agriculture: 'bg-green-500 text-white',
      general: 'bg-gray-500 text-white'
    };
    return colors[category] || colors.general;
  };

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'development', label: 'Development' },
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'culture', label: 'Culture' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'general', label: 'General' }
  ];

  // Filter news
  const filteredNews = newsItems.filter(news => {
    const matchesSearch = searchTerm === '' || 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (news.location && news.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderVideoPlayer = (video: string, index: number) => {
    let videoSrc = video;
    let videoName = `Community Video ${index + 1}`;
    let fileSize = '';
    
    // Check if it's Firebase Storage metadata
    if (video.startsWith('{')) {
      try {
        const metadata = JSON.parse(video);
        if (metadata.url && metadata.name) {
          videoSrc = metadata.url;
          videoName = metadata.name;
          fileSize = metadata.size ? `${(metadata.size / 1024 / 1024).toFixed(1)} MB` : '';
        }
      } catch (e) {
        // If parsing fails, treat as direct video URL
        videoSrc = video;
      }
    }
    
    return (
      <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden mb-8 shadow-2xl">
        <div className="bg-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white font-bold">📹 {videoName}</span>
          </div>
          {fileSize && (
            <span className="text-slate-300 font-medium">{fileSize}</span>
          )}
        </div>
        <div className="p-4">
          <video
            src={videoSrc}
            controls
            preload="metadata"
            className="w-full rounded-xl shadow-lg"
            style={{ maxHeight: '600px', backgroundColor: '#1f2937' }}
            onError={(e) => {
              // Handle video errors gracefully
              e.currentTarget.style.display = 'block';
            }}
          >
            <p className="text-white text-center py-8">
              Your browser does not support the video tag.
            </p>
          </video>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/20 rounded-lg w-64 mx-auto"></div>
              <div className="h-16 bg-white/10 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-16 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <span className="font-medium tracking-wide">📰 MDPU COMMUNITY NEWS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              News & Updates
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Stay connected with the latest developments, stories, and announcements from Mathamba Village and our progressive union
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search news, stories, and community updates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-6 py-4 h-14 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg bg-white font-medium"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-8">📰</div>
            <h3 className="text-3xl font-bold text-slate-700 mb-4">
              {searchTerm || selectedCategory !== 'all' ? 'No matching news found' : 'No news available yet'}
            </h3>
            <p className="text-slate-500 text-xl max-w-lg mx-auto">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Check back soon for the latest updates from our community'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredNews.map((news) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-xl rounded-2xl">
                {/* Featured Image */}
                {news.featuredImage && (
                  <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200">
                    <img 
                      src={news.featuredImage} 
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    {news.isUrgent && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-xl">
                          🚨 URGENT
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${getCategoryColor(news.category)} shadow-xl font-bold`}>
                        {news.category.toUpperCase()}
                      </Badge>
                    </div>
                    {/* Video indicator */}
                    {news.videos && news.videos.length > 0 && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                          <Play className="w-4 h-4 mr-2" />
                          {news.videos.length} Video{news.videos.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight mb-3">
                    {news.title}
                  </CardTitle>

                  {/* VIDEO PREVIEW - RIGHT AFTER TITLE ON CARD */}
                  {news.videos && news.videos.length > 0 && (
                    <div className="mb-3">
                      {(() => {
                        const video = news.videos[0];
                        let videoSrc = video;
                        let videoName = 'Community Video';
                        
                        // Parse Firebase Storage metadata if present
                        if (video.startsWith('{')) {
                          try {
                            const metadata = JSON.parse(video);
                            if (metadata.url && metadata.name) {
                              videoSrc = metadata.url;
                              videoName = metadata.name;
                            }
                          } catch (e) {
                            videoSrc = video;
                          }
                        }
                        
                        return (
                          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-lg">
                            <div className="bg-slate-700 px-4 py-2 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-white font-semibold text-sm">📹 {videoName}</span>
                              </div>
                              {news.videos.length > 1 && (
                                <span className="text-slate-300 text-xs">+{news.videos.length - 1} more</span>
                              )}
                            </div>
                            <div className="p-3">
                              <video
                                src={videoSrc}
                                controls
                                preload="metadata"
                                className="w-full rounded-lg shadow-md"
                                style={{ maxHeight: '200px', backgroundColor: '#1f2937' }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'block';
                                }}
                              >
                                <p className="text-white text-center py-4 text-sm">
                                  Video preview unavailable
                                </p>
                              </video>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ENGAGEMENT BUTTONS - IMMEDIATELY AFTER VIDEO (Facebook Layout) */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-1">
                      {/* Views */}
                      <div className="flex items-center text-slate-500 text-sm mr-4">
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="font-medium">{news.views || 0} views</span>
                      </div>
                      
                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (news.id) handleEngagement(news.id, 'like', news);
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 ${
                          user && news.likedBy?.includes(user.uid) 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${user && news.likedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
                        <span className="font-semibold text-sm">{news.likes || 0}</span>
                      </button>

                      {/* Dislike Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (news.id) handleEngagement(news.id, 'dislike', news);
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 ${
                          user && news.dislikedBy?.includes(user.uid) 
                            ? 'bg-red-100 text-red-600' 
                            : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className={`w-4 h-4 ${user && news.dislikedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
                        <span className="font-semibold text-sm">{news.dislikes || 0}</span>
                      </button>

                      {/* Love Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (news.id) handleEngagement(news.id, 'love', news);
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 ${
                          user && news.lovedBy?.includes(user.uid) 
                            ? 'bg-pink-100 text-pink-600' 
                            : 'text-slate-600 hover:bg-pink-50 hover:text-pink-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${user && news.lovedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
                        <span className="font-semibold text-sm">{news.loves || 0}</span>
                      </button>
                    </div>

                    {/* Sign in prompt for non-authenticated users */}
                    {!user && (
                      <div className="text-xs text-slate-400">
                        Sign in to interact
                      </div>
                    )}
                  </div>

                  <div className="text-slate-600 line-clamp-3 text-base leading-relaxed mb-4">
                    {news.summary}
                  </div>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(news.publishedAt || news.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {news.authorName}
                    </div>
                    {news.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {news.location}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {news.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {news.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                      {news.tags.length > 3 && (
                        <span className="text-xs text-slate-500 px-2 py-1">+{news.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  {/* Read More Button */}
                  <Button 
                    onClick={() => handleReadMore(news)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Read Full Story
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Professional News Detail Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-6xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-8">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={`${getCategoryColor(selectedNews.category)} shadow-lg px-4 py-2 font-bold text-sm`}>
                        {selectedNews.category.toUpperCase()}
                      </Badge>
                      {selectedNews.isUrgent && (
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg">
                          🚨 URGENT NEWS
                        </span>
                      )}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight text-white drop-shadow-lg">{selectedNews.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-blue-100 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        {formatDate(selectedNews.publishedAt || selectedNews.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        {selectedNews.authorName}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        {selectedNews.views || 0} views
                      </div>
                      {selectedNews.location && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2" />
                          {selectedNews.location}
                        </div>
                      )}
                    </div>

                    {/* ENGAGEMENT BUTTONS IN MODAL */}
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedNews.id) handleEngagement(selectedNews.id, 'like', selectedNews);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                          user && selectedNews.likedBy?.includes(user.uid) 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <ThumbsUp className={`w-5 h-5 ${user && selectedNews.likedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
                        <span className="font-semibold">{selectedNews.likes || 0}</span>
                      </button>

                      {/* Dislike Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedNews.id) handleEngagement(selectedNews.id, 'dislike', selectedNews);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                          user && selectedNews.dislikedBy?.includes(user.uid) 
                            ? 'bg-red-500 text-white shadow-lg' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <ThumbsDown className={`w-5 h-5 ${user && selectedNews.dislikedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
                        <span className="font-semibold">{selectedNews.dislikes || 0}</span>
                      </button>

                      {/* Love Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedNews.id) handleEngagement(selectedNews.id, 'love', selectedNews);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                          user && selectedNews.lovedBy?.includes(user.uid) 
                            ? 'bg-pink-500 text-white shadow-lg' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${user && selectedNews.lovedBy?.includes(user.uid) ? 'fill-current' : ''}`} />
                        <span className="font-semibold">{selectedNews.loves || 0}</span>
                      </button>

                      {/* Sign in prompt for non-authenticated users */}
                      {!user && (
                        <div className="text-sm text-blue-200 ml-4">
                          Sign in to interact with this post
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSelectedNews(null)}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 ml-6 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* MEDIA SECTION - IMMEDIATELY AFTER TITLE */}
              <div className="px-8 pt-8">
                {/* VIDEOS - FIRST PRIORITY MEDIA */}
                {selectedNews.videos && selectedNews.videos.length > 0 && (
                  <div className="mb-8">
                    <div className="space-y-6">
                      {selectedNews.videos.map((video, index) => renderVideoPlayer(video, index))}
                    </div>
                  </div>
                )}

                {/* FEATURED IMAGE - SECOND PRIORITY MEDIA */}
                {selectedNews.featuredImage && (
                  <div className="mb-8">
                    <img 
                      src={selectedNews.featuredImage} 
                      alt={selectedNews.title}
                      className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                )}

                {/* IMAGES GALLERY - THIRD PRIORITY MEDIA */}
                {selectedNews.images && selectedNews.images.length > 0 && (
                  <div className="mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedNews.images.map((image, index) => (
                        <div key={index} className="group cursor-pointer">
                          <img 
                            src={image} 
                            alt={`${selectedNews.title} - Image ${index + 1}`}
                            className="w-full h-40 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                            onClick={() => window.open(image, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ALL TEXT CONTENT - AT THE BOTTOM */}
              <div className="px-8 pb-8">
                <div className="mb-10">
                  <div className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed border-l-4 border-blue-500 pl-8 bg-blue-50 py-6 rounded-r-xl">
                    {selectedNews.summary}
                  </div>
                  <div className="prose prose-xl max-w-none text-slate-700 leading-relaxed">
                    <div className="whitespace-pre-wrap text-lg">
                      {selectedNews.content}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedNews.tags.length > 0 && (
                  <div className="border-t border-slate-200 pt-8">
                    <h4 className="text-xl font-bold text-slate-700 mb-6">🏷️ Related Topics:</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedNews.tags.map((tag, index) => (
                        <span key={index} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
