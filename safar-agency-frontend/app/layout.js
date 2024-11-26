"use client";

import Sidebar from './components/Sidebar';
import Navbar from './navbar/page';
import './globals.css';
import Footer from './components/Footer';
import { AuthProvider } from './context/userContext';
import Breadcrumbs from './components/Breadcrumbs';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
      <AuthProvider>
        <Navbar />
       
        <div className="flex flex-grow"> {/* This flex container holds the sidebar and main content */}
          <Sidebar />
          <main className="flex-grow p-4 ml-64"> {/* Adjust margin-left based on sidebar width */}
            <Breadcrumbs/>
            {children}
           
          </main>
        </div>
        <Footer />
        </AuthProvider>
      </body>
     
    </html>
  );
}
