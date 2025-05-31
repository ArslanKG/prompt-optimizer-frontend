import React from 'react';
import { Container, Box } from '@mui/material';
import PromptOptimizer from '../components/PromptOptimizer/PromptOptimizer';
import { motion } from 'framer-motion';

const Chat = () => {
  return (
    <Box sx={{ minHeight: '100vh', pt: 10, pb: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PromptOptimizer />
        </motion.div>
      </Container>
    </Box>
  );
};

export default Chat;