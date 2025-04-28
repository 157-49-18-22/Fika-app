import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./Contact.css";
import Testimonials from "../Testimonials/Testimonials.jsx";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/contact", form)
      .then(() => {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
      })
      .catch(err => {
        alert("Error: " + (err.response?.data?.error || err.message));
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const formVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  const infoVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.4
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const socialIconVariants = {
    hover: {
      y: -5,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div 
      className="contact-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="contact-card">
        <motion.div 
          className="contact-card-content"
          variants={containerVariants}
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="contact-form-area"
            variants={formVariants}
          >
            <motion.h1 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Let's talk
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              To request a quote or want to meet up for coffee, contact us directly or fill out the form and we will get back to you promptly.
            </motion.p>
            
            <motion.form 
              className="contact-form" 
              onSubmit={handleSubmit}
              variants={itemVariants}
            >
              <motion.div 
                className="form-group" 
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <label htmlFor="name">Your Name</label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </motion.div>
              <motion.div 
                className="form-group" 
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <label htmlFor="email">Your Email</label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>
              <motion.div 
                className="form-group" 
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <label htmlFor="message">Your Message</label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
              {showSuccess && (
                <div className="success-message">
                  <span>✓ Message sent successfully!</span>
                </motion.div>
              )}
            </motion.form>
          </motion.div>

          <motion.div 
            className="contact-info-area"
            variants={infoVariants}
          >
            <motion.div 
              className="contact-illustration"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/contact-us-3483601-2912018.png" alt="Contact illustration" />
            </motion.div>
            <motion.div 
              className="contact-details" 
              variants={itemVariants}
            >
              <motion.p 
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaMapMarkerAlt /> 151 New Park Ave, Hartford, CT 06106 United States
              </motion.p>
              <motion.p 
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaPhoneAlt /> +1 (203) 302-9545
              </motion.p>
              <motion.p 
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaEnvelope /> contactus@invertasoft.com
              </motion.p>
            </motion.div>
            <motion.div 
              className="contact-socials" 
              variants={itemVariants}
            >
              <motion.a 
                href="#" 
                aria-label="Facebook"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a 
                href="#" 
                aria-label="Twitter"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="#" 
                aria-label="Instagram"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaInstagram />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="testimonials-section-wrapper"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
      >
        <Testimonials />
      </motion.div>
    </motion.div>
  );
};

export default Contact; 
