import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/hiteshparmar18/hiteshparmar18-",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/hiteshparmar18/",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:parmarhitesh93516@gmail.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="py-8 sm:py-12 border-t border-border">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <a href="#" className="font-heading text-xl font-bold gradient-text">
              Hitesh Parmar
            </a>
            <p className="text-muted-foreground text-sm mt-2">
              AI & Machine Learning Engineer
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link text-sm">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1 flex-wrap">
            © {currentYear} Hitesh Parmar. Built with{" "}
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary" fill="currentColor" /> and React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
