import { motion } from "framer-motion";
import { MapPin, Calendar, Target, Sparkles } from "lucide-react";
import portfolioImage from "@/assets/portfolio-image.jpeg";

const About = () => {
  return (
    <section id="about" className="py-12 sm:py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
            Get to know more about my journey, passion, and goals in the world of AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-5 sm:p-8 md:p-12 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] gap-6 sm:gap-8 items-start">
            {/* Profile Image Placeholder */}
            <div className="flex justify-center md:justify-start">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border border-card-border">
                <img src={portfolioImage} alt="Hitesh Parmar" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-heading font-bold mb-2">
                  Hitesh Parmar
                </h3>
                <p className="text-secondary font-medium mb-4">
                  AI & Machine Learning Engineer
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                I'm a passionate AI and Machine Learning Engineer dedicated to
                building intelligent systems that solve real-world problems. With
                expertise in data analysis, predictive modeling, and deep learning,
                I transform complex data into actionable insights and innovative
                solutions.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                My journey in AI started with a curiosity about how machines can
                learn and make decisions. Today, I specialize in developing
                production-ready ML models, creating interactive data dashboards,
                and building end-to-end data pipelines. I believe in continuous
                learning and staying updated with the latest advancements in AI.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span>India</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span>Available for opportunities</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <span>Data-driven solutions</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <span>Lifelong learner</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
