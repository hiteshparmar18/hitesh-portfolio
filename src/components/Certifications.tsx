import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, FileText, Eye } from "lucide-react";
import CertificateModal from "./CertificateModal";
import { supabase } from "@/integrations/supabase/client";

interface Certification {
  title: string;
  issuer: string;
  date: string;
  description: string;
  type: "certification" | "publication";
  skills: string[];
  verifyUrl?: string;
  imageUrl?: string;
}

const CertificationCard = ({
  cert,
  index,
  onViewCertificate,
}: {
  cert: Certification;
  index: number;
  onViewCertificate: (cert: Certification) => void;
}) => {
  const Icon = cert.type === "publication" ? FileText : Award;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="glass-card p-4 sm:p-5 h-full flex flex-col group"
    >
      <div className="flex items-start gap-2 sm:gap-3 mb-3">
        <motion.div 
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            cert.type === "publication" ? "bg-secondary/10" : "bg-primary/10"
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${cert.type === "publication" ? "text-secondary" : "text-primary"}`} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-heading font-semibold leading-tight">{cert.title}</h3>
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                aria-label="Verify certificate"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <p className="text-secondary text-xs sm:text-sm">{cert.issuer}</p>
          <p className="text-muted-foreground text-xs mt-0.5">{cert.date}</p>
        </div>
      </div>

      <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 flex-1">{cert.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {cert.skills.map((skill, i) => (
          <motion.span 
            key={skill} 
            className="skill-tag text-xs py-1 px-2"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>

      {cert.imageUrl && (
        <motion.button
          onClick={() => onViewCertificate(cert)}
          className="w-full py-2.5 px-4 rounded-xl bg-primary/10 text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Eye className="w-4 h-4" />
          View Certificate
        </motion.button>
      )}

      {cert.type === "publication" && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-secondary font-medium">📄 Research Publication</span>
        </div>
      )}
    </motion.div>
  );
};

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    const fetchCertifications = async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data) {
        setCertifications(
          data.map((row) => ({
            title: row.title,
            issuer: row.issuer,
            date: row.date,
            description: row.description,
            type: row.type as "certification" | "publication",
            skills: row.skills,
            verifyUrl: row.verify_url ?? undefined,
            imageUrl: row.image_url ?? undefined,
          }))
        );
      }
    };
    fetchCertifications();
  }, []);

  return (
    <section id="certifications" className="py-12 sm:py-20 section-bg">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Certifications & <span className="gradient-text">Publications</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Professional certifications and research publications demonstrating continuous learning and expertise.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {certifications.map((cert, index) => (
            <CertificationCard 
              key={cert.title} 
              cert={cert} 
              index={index} 
              onViewCertificate={setSelectedCert}
            />
          ))}
        </div>
      </div>

      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title={selectedCert?.title || ""}
        imageUrl={selectedCert?.imageUrl || ""}
        verifyUrl={selectedCert?.verifyUrl}
      />
    </section>
  );
};

export default Certifications;
