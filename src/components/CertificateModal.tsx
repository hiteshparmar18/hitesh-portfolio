import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageUrl: string;
  verifyUrl?: string;
}

const CertificateModal = ({ isOpen, onClose, title, imageUrl, verifyUrl }: CertificateModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden glass-card p-1 sm:p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 sm:p-4 border-b border-border gap-2">
              <h3 className="text-sm sm:text-lg font-heading font-semibold truncate flex-1">{title}</h3>
              <div className="flex items-center gap-2">
                {verifyUrl && (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                    aria-label="Verify certificate"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                <a
                  href={imageUrl}
                  download
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  aria-label="Download certificate"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="p-2 sm:p-4 overflow-auto max-h-[calc(95vh-60px)] sm:max-h-[calc(90vh-80px)]">
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                src={imageUrl}
                alt={title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
