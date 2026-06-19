import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const AddToCart = ({ product }) => {
    const router = useRouter();

    const handleCart = async () => {
        try {
            const res = await axios.post("/api/cart", {
                productId: product._id,
            });
            if (res.data) {
                toast.success("Added to cart 🛒", {
                    autoClose: 1200,
                });
            } else {
                toast.error("Failed to add to cart");
            }

        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    return (
        <button
            onClick={handleCart}
            type="button"
            className="flex-1 bg-gray-600 hover:bg-white/20 transition py-3 rounded-xl font-medium"
        >
            Add to Cart
        </button>
    );
};

export default AddToCart;