import { memo } from 'react';

const Footer = memo(function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          © 2024 Quran Web App. Built with Next.js and Tailwind CSS.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Data provided by AlQuran Cloud API
        </p>
      </div>
    </footer>
  );
});

export default Footer;