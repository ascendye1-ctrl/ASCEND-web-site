
import React, { useEffect } from 'react';
import { Language } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  language: Language;
  path?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, language, path }) => {
  const defaultTitle = "ASCEND | Premium E-Commerce";
  const defaultDescription = "Elevate your lifestyle with ASCEND's premium collection of apparel, accessories, and gear.";
  const siteUrl = "https://ascend-store.demo"; // Mock URL

  useEffect(() => {
    // Update Title
    document.title = title ? `${title} | ASCEND` : defaultTitle;

    // Update Meta Description
    let metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description || defaultDescription);

    // Update HTML attributes for Accessibility and SEO
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    // Update Open Graph Tags (Basic Mock)
    const updateMeta = (name: string, content: string) => {
        let tag = document.querySelector(`meta[property='${name}']`);
        if (!tag) {
            tag = document.createElement("meta");
            tag.setAttribute("property", name);
            document.head.appendChild(tag);
        }
        tag.setAttribute("content", content);
    };

    updateMeta('og:title', title || defaultTitle);
    updateMeta('og:description', description || defaultDescription);
    if (path) updateMeta('og:url', `${siteUrl}${path}`);

  }, [title, description, language, path]);

  return null;
};

export default SEO;
