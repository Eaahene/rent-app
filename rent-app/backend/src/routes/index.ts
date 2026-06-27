import { Router } from 'express';
import authRoutes from './authRoutes';
import propertyRoutes from './propertyRoutes';
import inquiryRoutes from './inquiryRoutes';
import adminRoutes from './adminRoutes';
import uploadRoutes from './uploadRoutes';
import settingsRoutes from './settingsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/settings', settingsRoutes);

export default router;
