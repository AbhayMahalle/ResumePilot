
import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";







const AccordionContext = createContext(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
};








export const Accordion = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = ""
}) => {
  const [activeItems, setActiveItems] = useState(
    defaultOpen ? [defaultOpen] : []
  );

  const toggleItem = (id) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  const isItemActive = (id) => activeItems.includes(id);

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </AccordionContext.Provider>);

};







export const AccordionItem = ({ id, children, className = "" }) => {
  return (
    <div className={`rounded-xl border border-border overflow-hidden bg-white ${className}`}>
      {children}
    </div>);

};







export const AccordionHeader = ({
  itemId,
  children,
  className = ""
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <button
      onClick={() => toggleItem(itemId)}
      className={`w-full px-5 py-4 text-left focus:outline-none transition-colors duration-200 
        flex items-center justify-between cursor-pointer hover:bg-bg/50 ${className}`}>
      
      <div className="flex-1">{children}</div>
      <ChevronDown
        className={`w-5 h-5 text-text-muted transition-transform duration-300 shrink-0 ml-3 ${
        isActive ? "rotate-180" : ""}`
        } />
      
    </button>);

};







export const AccordionContent = ({
  itemId,
  children,
  className = ""
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <AnimatePresence initial={false}>
      {isActive &&
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden">
        
          <div className={`px-5 py-4 border-t border-border ${className}`}>{children}</div>
        </motion.div>
      }
    </AnimatePresence>);

};