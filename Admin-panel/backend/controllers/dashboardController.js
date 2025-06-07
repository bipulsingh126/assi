import User from '../models/User.js';
import Product from '../models/Product.js';


//   Private
export const getDashboardStats = async (req, res) => {
    try {
        // Get total users (admin might want to see this)
        const userCount = await User.countDocuments();

        // Get total products for current user only
        const productCount = await Product.countDocuments({ user: req.user.id });

        
        
        // These would also be filtered by user
        const orderCount = 156;
        const revenue = 15680;

        res.status(200).json({
            success: true,
            data: {
                users: userCount,
                products: productCount,
                orders: orderCount,
                revenue: revenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
} 