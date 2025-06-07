import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FormField = ({
    value,
    onChange,
    onSubmit,
    placeholder,
    iconName,
    isSubmitting,
    submitButtonVisible,
    id,
    className,
    inputClassName,
    buttonClassName
}) => {
    return (
        <form onSubmit={onSubmit} className={`relative ${className}`}>
            <div className="relative">
                <Input
                    id={id}
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-6 py-4 pl-14 bg-white rounded-2xl shadow-flow focus:shadow-glow focus:ring-2 focus:ring-primary/20 border border-surface-200 focus:border-primary transition-all duration-300 text-gray-900 placeholder-gray-500 ${inputClassName}`}
                    disabled={isSubmitting}
                />
                
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <ApperIcon name={iconName} className="w-5 h-5 text-primary" />
                </div>
                
                <AnimatePresence>
                    {submitButtonVisible && (
                        <Button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="submit"
                            disabled={isSubmitting}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-flow text-white rounded-xl shadow-flow hover:shadow-glow disabled:opacity-50 ${buttonClassName}`}
                        >
                            {isSubmitting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <ApperIcon name="Loader2" size={20} />
                                </motion.div>
                            ) : (
                                <ApperIcon name="Send" size={20} />
                            )}
                        </Button>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
};

export default FormField;