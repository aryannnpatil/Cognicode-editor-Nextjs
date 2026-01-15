# CogniCode

**CogniCode With Intelligence** - A powerful and intelligent online code editor that enhances your coding experience with advanced features and seamless integration.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)

## 🚀 Features

- **🎨 Interactive Code Playground**: Create, edit, and run code directly in the browser using WebContainers technology
- **📦 Multiple Templates**: Support for various frameworks including React, Next.js, Express, Django, Vue, Hono, and Angular
- **🔐 Authentication**: Secure user authentication powered by Clerk
- **💾 Project Management**: Save, organize, and manage your code playgrounds
- **⭐ Star System**: Mark and favorite your important playgrounds
- **🎯 Monaco Editor Integration**: Professional code editing experience with syntax highlighting
- **🌓 Dark/Light Theme**: Seamless theme switching with next-themes
- **📱 Responsive Design**: Fully responsive UI built with Tailwind CSS and Radix UI
- **🗄️ Database Integration**: MongoDB backend with Prisma ORM for data persistence

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.7 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4 with Radix UI components
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **WebContainers**: @webcontainer/api for in-browser runtime
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React & React Icons

### Backend
- **Database**: MongoDB
- **ORM**: Prisma 6.19
- **Authentication**: Clerk (@clerk/nextjs)
- **API**: Next.js API Routes

### Developer Tools
- **Language**: TypeScript 5.x
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm/pnpm/yarn

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- MongoDB database (local or cloud instance)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cognicode
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database
   DATABASE_URL="your-mongodb-connection-string"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   
   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. **Set up Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
cognicode/
├── app/                      # Next.js App Router
│   ├── (root)/              # Root layout and home page
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard pages
│   ├── playground/          # Playground pages
│   ├── sign-in/            # Authentication pages
│   └── sign-up/
├── components/              # Reusable UI components
│   ├── ui/                 # Shadcn UI components
│   └── providers/          # Context providers
├── modules/                 # Feature modules
│   ├── auth/               # Authentication logic
│   ├── dashboard/          # Dashboard features
│   ├── home/               # Home page components
│   ├── playground/         # Playground features
│   └── webContainers/      # WebContainer integration
├── prisma/                  # Database schema
├── generated/prisma/        # Generated Prisma client
├── lib/                     # Utility functions
├── hooks/                   # Custom React hooks
└── public/                  # Static assets
```

## 🎮 Usage

### Creating a Playground

1. Navigate to the Dashboard
2. Click on "Add New" button
3. Select a template (React, Next.js, Express, etc.)
4. Configure your playground settings
5. Start coding!

### Managing Playgrounds

- **Star**: Mark important playgrounds for quick access
- **Edit**: Modify playground title and description
- **Duplicate**: Create a copy of existing playground
- **Delete**: Remove playgrounds you no longer need

### Using the Code Editor

- Write code in the Monaco editor
- Real-time preview using WebContainers
- Auto-save functionality
- File system management

## 🗃️ Database Schema

### Models

- **User**: User accounts with Clerk integration
- **Playground**: Code playground instances
- **TemplateFiles**: Store template file contents
- **StarMark**: Track starred playgrounds

### User Roles
- `USER`: Standard user
- `PREMIUM_USER`: Premium features access
- `ADMIN`: Administrative privileges

### Supported Templates
- React
- Next.js
- Express
- Django
- Vue
- Hono
- Angular

## 🎨 Customization

### Theme Configuration

The project uses `next-themes` for theme management. Customize themes in:
- `app/globals.css` - Global styles
- `components/providers/theme-providers.tsx` - Theme provider setup
- `components/ui/theme-toggle.tsx` - Theme switcher component

### UI Components

All UI components are built with Radix UI primitives and styled with Tailwind CSS. Find them in the `components/ui/` directory.

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables
4. Deploy!

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [WebContainers](https://webcontainers.io/)
- [Clerk](https://clerk.com/)
- [Prisma](https://www.prisma.io/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## 📧 Contact

For questions and support, please open an issue in the repository.

---

**Built with ❤️ using Next.js and WebContainers**
