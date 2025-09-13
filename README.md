# MDPU Website - Mathamba Descendants Progressive Union

A production-grade Next.js 14+ website for the Mathamba Descendants Progressive Union (MDPU), built with modern web technologies and best practices.

## 🚀 Features

### Design System
- **Tailwind CSS** with custom Palette B color scheme
- **shadcn/ui** components for consistent UI
- **Responsive design** that works on all devices
- **Dark mode support** with brand-appropriate colors

### Color Palette (Palette B)
- **Forest** (#14532D) - Primary color
- **Clay** (#92400E) - Secondary color  
- **Gold** (#D97706) - CTA/Accent color
- **Charcoal** (#111827) - Text/Headings
- **Sand** (#F3F4F6) - Background

### Pages & Functionality
- **Home** - Hero with motto "Togetherness is Strength," CTA buttons, featured projects, next meeting
- **About** - Organization story, mission, vision, values, and contact information
- **Objectives** - Core objectives and constitution highlights
- **Leadership** - Executive committee, board members, and chapter leaders
- **Projects** - Active, completed, and planned projects with impact metrics
- **Events** - Monthly meetings and special events calendar
- **Membership** - Join form with React Hook Form + Zod validation
- **Donate** - One-time and recurring donation options with project-specific giving
- **Constitution** - Complete constitution with PDF download option
- **Chapters** - Global chapter network and "Start a Chapter" form
- **Contact** - Office address and contact form

### Technical Features
- **TypeScript** for type safety
- **React Hook Form + Zod** for form validation
- **Accessibility** - AA contrast, focus states, semantic HTML, skip links
- **Performance** - Optimized images, prefetching, compression
- **SEO** - Proper metadata, Open Graph tags, structured data
- **Security** - Security headers, input validation, XSS protection

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mdpu-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
mdpu-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/
│   │   ├── chapters/
│   │   ├── constitution/
│   │   ├── contact/
│   │   ├── donate/
│   │   ├── events/
│   │   ├── leadership/
│   │   ├── membership/
│   │   ├── objectives/
│   │   ├── projects/
│   │   ├── globals.css         # Global styles with brand colors
│   │   ├── layout.tsx          # Root layout with header/footer
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── layout/             # Layout components
│   │   │   ├── SiteHeader.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── custom/         # Custom components
│   │   │   │   ├── PageHero.tsx
│   │   │   │   ├── Section.tsx
│   │   │   │   ├── Stat.tsx
│   │   │   │   ├── CTAButtons.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── LeadershipRoleCard.tsx
│   │   │   │   ├── JoinForm.tsx
│   │   │   │   └── SkipLink.tsx
│   │   │   └── [shadcn components]
│   │   └── lib/
│   │       └── utils.ts        # Utility functions
├── public/                     # Static assets
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── components.json            # shadcn/ui configuration
└── package.json
```

## 🎨 Design System

### Brand Colors
The website uses a carefully selected color palette that reflects the organization's values:

- **Forest Green** - Represents growth, stability, and connection to heritage
- **Clay Brown** - Symbolizes earth, foundation, and tradition
- **Gold** - Conveys excellence, achievement, and warmth
- **Charcoal** - Provides strong contrast for text and headings
- **Sand** - Creates a clean, welcoming background

### Typography
- **Headings**: Bold, clear hierarchy with proper contrast
- **Body Text**: Readable font sizes with appropriate line spacing
- **Accessibility**: AA contrast ratios maintained throughout

### Components
- **Consistent spacing** using Tailwind's spacing scale
- **Hover states** and **focus indicators** for better UX
- **Responsive design** that works on all screen sizes
- **Semantic HTML** for better accessibility and SEO

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Mobile devices** (320px and up)
- **Tablets** (768px and up)
- **Desktop** (1024px and up)
- **Large screens** (1280px and up)

## ♿ Accessibility Features

- **Skip links** for keyboard navigation
- **Semantic HTML** structure
- **ARIA labels** where appropriate
- **Focus management** for interactive elements
- **Color contrast** meeting WCAG AA standards
- **Screen reader** compatibility

## 🚀 Performance Optimizations

- **Image optimization** with Next.js Image component
- **Code splitting** and lazy loading
- **Compression** enabled
- **Security headers** configured
- **Bundle optimization** for faster loading

## 📝 Content Management

Currently, the website uses static content. For production deployment, consider integrating with:
- **Headless CMS** (Strapi, Contentful, Sanity)
- **Database** (PostgreSQL, MongoDB)
- **Authentication** (NextAuth.js, Auth0)

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Adding New Pages

1. Create a new directory in `src/app/`
2. Add a `page.tsx` file with your page component
3. Update navigation in `SiteHeader.tsx` if needed
4. Add metadata for SEO

### Adding New Components

1. Create component in appropriate directory
2. Export from component file
3. Import and use in pages
4. Follow existing patterns for consistency

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js
- **AWS Amplify**: Full-stack deployment
- **Railway**: Simple deployment with database options

## 📄 License

This project is proprietary to the Mathamba Descendants Progressive Union.

## 🤝 Contributing

For contributions to this project, please:
1. Follow the existing code style
2. Ensure accessibility standards are met
3. Test on multiple devices and browsers
4. Update documentation as needed

## 📞 Support

For technical support or questions about the website:
- **Email**: tech@mdpu.org
- **Phone**: +232 123 456 789
- **Office**: 19n Thompson Bay, off Wilkinson Road, Freetown, Sierra Leone

---

**MDPU Motto**: "Togetherness is Strength" 🌟