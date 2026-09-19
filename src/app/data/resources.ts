import { BookOpen, FileText, Mail, BookMarked, Sparkles, Award } from 'lucide-angular';
import type { LucideIconData } from '../core/lucide-icon.type';

export type Tab = 'all' | 'blogs' | 'whitepapers' | 'newsletter' | 'ebooks' | 'case-studies';

export interface Resource {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  type: Exclude<Tab, 'all'>;
  date: string;
  readTime: string;
  featured?: boolean;
}

export const RESOURCES: Resource[] = [
  // Blogs
  {
    id: 'b1',
    title: 'IFC Viewers You Should Try Today',
    excerpt: 'A comprehensive guide to the top IFC viewer tools for architects and BIM managers working with digital twin environments in 2025.',
    category: 'DXF / 2D',
    categoryColor: 'blue',
    type: 'blogs',
    date: '12 Feb 2025',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: 'b2',
    title: 'Point Cloud Processing for Scan-to-BIM Workflows',
    excerpt: 'Learn how high-density LiDAR scans integrate into BIM workflows and what tools make the process seamless at scale.',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    type: 'blogs',
    date: '28 Jan 2025',
    readTime: '8 min read',
  },
  {
    id: 'b3',
    title: 'Rights of Light Analysis: A Digital Twin Approach',
    excerpt: 'How solar envelopes and ROL simulations are transforming property development decisions in dense urban environments.',
    category: 'ROL',
    categoryColor: 'amber',
    type: 'blogs',
    date: '15 Jan 2025',
    readTime: '6 min read',
  },
  {
    id: 'b4',
    title: 'Clash Detection Best Practices in Modern BIM',
    excerpt: 'Preventing costly on-site conflicts starts with precise clash detection. Here\'s how AxisXD handles multi-model review.',
    category: 'BIM',
    categoryColor: 'indigo',
    type: 'blogs',
    date: '03 Jan 2025',
    readTime: '7 min read',
  },
  {
    id: 'b5',
    title: '360° Photogrammetry vs LiDAR: Which to Choose?',
    excerpt: 'A data-driven comparison of panoramic photogrammetry and LiDAR scanning for construction site reality capture.',
    category: 'PANO',
    categoryColor: 'blue',
    type: 'blogs',
    date: '20 Dec 2024',
    readTime: '5 min read',
  },
  {
    id: 'b6',
    title: 'ISO 19650 Compliance with Digital Twin Platforms',
    excerpt: 'Understanding how ISO 19650 information management standards apply to modern digital twin deployments and BIM data.',
    category: 'BIM',
    categoryColor: 'indigo',
    type: 'blogs',
    date: '05 Dec 2024',
    readTime: '9 min read',
  },
  {
    id: 'construction-monitoring',
    title: 'Construction Progress Monitoring: The Digital Twin Advantage',
    excerpt: 'How digital twin platforms are transforming construction site monitoring with timeline comparison, visual evidence, and automated status tracking.',
    category: 'MONITORING',
    categoryColor: 'blue',
    type: 'blogs',
    date: '14 Apr 2025',
    readTime: '9 min read',
    featured: true,
  },
  // Whitepapers
  {
    id: 'w1',
    title: 'Digital Twin Integration Framework for Construction Sites',
    excerpt: 'An in-depth technical guide on deploying integrated digital twin systems across multi-phase construction projects at enterprise scale.',
    category: 'BIM',
    categoryColor: 'indigo',
    type: 'whitepapers',
    date: 'Jan 2025',
    readTime: '24 pages',
    featured: true,
  },
  {
    id: 'w2',
    title: 'Point Cloud Data Management at Scale',
    excerpt: 'Strategies for storing, processing, and streaming high-density point cloud datasets across distributed engineering teams.',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    type: 'whitepapers',
    date: 'Oct 2024',
    readTime: '18 pages',
  },
  {
    id: 'w3',
    title: 'IFC Standard & BIM Digital Twin Compliance Guide',
    excerpt: 'A technical whitepaper covering IFC schema compliance, BIM data fidelity, and integration best practices for AEC professionals.',
    category: 'DXF / 2D',
    categoryColor: 'blue',
    type: 'whitepapers',
    date: 'Aug 2024',
    readTime: '31 pages',
  },
  {
    id: 'w4',
    title: 'Deviation Analysis Methodologies in As-Built Verification',
    excerpt: 'Comparing geometric deviation analysis workflows against ISO-12053 tolerance standards in real-world scan-to-BIM projects.',
    category: 'DEVIATION',
    categoryColor: 'rose',
    type: 'whitepapers',
    date: 'Jun 2024',
    readTime: '22 pages',
  },
  // Newsletter
  {
    id: 'n1',
    title: 'AxisXD Monthly: February 2025',
    excerpt: 'This month: enhanced IFC viewer performance, new deviation analysis tools, and a full case study from the Hudson Yards project.',
    category: 'NEWSLETTER',
    categoryColor: 'emerald',
    type: 'newsletter',
    date: '01 Feb 2025',
    readTime: '3 min read',
    featured: true,
  },
  {
    id: 'n2',
    title: 'AxisXD Monthly: January 2025: New Features',
    excerpt: 'Introducing clash detection v2, improved panorama bubble navigation, and our first ISO compliance report template.',
    category: 'NEWSLETTER',
    categoryColor: 'emerald',
    type: 'newsletter',
    date: '01 Jan 2025',
    readTime: '3 min read',
  },
  {
    id: 'n3',
    title: 'AxisXD Monthly: Q4 2024 Review',
    excerpt: 'A look back at Q4: 230M sqft digitized, 12 enterprise integrations shipped, and a preview of what\'s coming in 2025.',
    category: 'NEWSLETTER',
    categoryColor: 'emerald',
    type: 'newsletter',
    date: '01 Dec 2024',
    readTime: '4 min read',
  },
  // Ebooks
  {
    id: 'e1',
    title: 'The Complete Guide to Digital Twin Implementation',
    excerpt: 'From IFC import to LiDAR integration: a step-by-step ebook for AEC professionals adopting digital twins for the first time.',
    category: 'BIM',
    categoryColor: 'indigo',
    type: 'ebooks',
    date: '2025',
    readTime: '62 pages',
    featured: true,
  },
  {
    id: 'e2',
    title: 'Point Cloud Scanning for Construction Professionals',
    excerpt: 'Master the end-to-end workflow: scan setup, data capture, cloud processing, and full BIM model integration.',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    type: 'ebooks',
    date: '2024',
    readTime: '48 pages',
  },
  {
    id: 'e3',
    title: 'Rights of Light: A Practical Guide for Developers',
    excerpt: 'Everything property developers need to know about ROL assessments, sun path analysis, and shadow impact modeling.',
    category: 'ROL',
    categoryColor: 'amber',
    type: 'ebooks',
    date: '2024',
    readTime: '36 pages',
  },
  // Case Studies
  {
    id: 'cs1',
    title: 'Hudson Yards Complex: Digital Twin at Scale',
    excerpt: 'How AxisXD enabled real-time progress monitoring across a 28-million-square-foot mixed-use development with 3D clash detection.',
    category: 'BIM',
    categoryColor: 'indigo',
    type: 'case-studies',
    date: '15 Mar 2025',
    readTime: '12 min read',
    featured: true,
  },
  {
    id: 'cs2',
    title: 'Scan-to-BIM: 45% Faster Project Delivery',
    excerpt: 'A major UK contractor reduced BIM model creation time from 12 weeks to 6.5 weeks using automated point cloud processing.',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    type: 'case-studies',
    date: '02 Mar 2025',
    readTime: '8 min read',
  },
  {
    id: 'cs3',
    title: 'Rights of Light Analysis: Urban Development Success',
    excerpt: 'Using AxisXD ROL analysis, a developer identified optimal building orientation, saving €2.3M in redesign costs.',
    category: 'ROL',
    categoryColor: 'amber',
    type: 'case-studies',
    date: '18 Feb 2025',
    readTime: '10 min read',
  },
  {
    id: 'cs4',
    title: 'Construction Site Reality Capture: 360° Panorama vs LiDAR',
    excerpt: 'A comparative study showing how combined panorama + LiDAR capture reduced inspection time by 60%.',
    category: 'MONITORING',
    categoryColor: 'blue',
    type: 'case-studies',
    date: '05 Feb 2025',
    readTime: '7 min read',
  },
];

export const TABS: { id: Tab; label: string; icon: LucideIconData }[] = [
  { id: 'all', label: 'All Resources', icon: Sparkles },
  { id: 'blogs', label: 'Blogs', icon: BookOpen },
  { id: 'case-studies', label: 'Case Studies', icon: Award },
  { id: 'whitepapers', label: 'Whitepapers', icon: FileText },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'ebooks', label: 'Ebooks', icon: BookMarked },
];

export const GRADIENT_BG: Record<string, string> = {
  blue: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700',
  cyan: 'bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600',
  amber: 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500',
  indigo: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700',
  purple: 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600',
  emerald: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600',
  rose: 'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600',
};

export const CATEGORY_STYLES: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
};

export const TYPE_ICON: Record<string, LucideIconData> = {
  blogs: BookOpen,
  whitepapers: FileText,
  newsletter: Mail,
  ebooks: BookMarked,
  'case-studies': Award,
};

export const TYPE_ACTION: Record<string, string> = {
  blogs: 'Read Article',
  whitepapers: 'Download PDF',
  newsletter: 'Read Issue',
  ebooks: 'Download Ebook',
  'case-studies': 'View Case Study',
};

export const ALL_CATEGORIES = [...new Set(RESOURCES.map(r => r.category))];
