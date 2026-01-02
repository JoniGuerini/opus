import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts/app-context";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { CommandMenu } from "@/components/command-menu";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Opus - Plataforma SaaS",
  description: "Gerenciamento de projetos e colaboração em equipe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                  <SidebarTrigger className="-ml-1" />
                  <DynamicBreadcrumb />
                  <div className="flex-1" />
                  <CommandMenu />
                  <ModeToggle />
                </header>
                <main className="flex-1 p-4">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
