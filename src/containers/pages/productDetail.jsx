import { useParams } from "react-router";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/hocs/Layout";
import {
  add_wishlist_item,
  get_wishlist_items,
  get_wishlist_item_total,
  remove_wishlist_item,
} from "../../redux/actions/wishlist";
import {
  get_product,
  get_related_products,
} from "../../redux/actions/products";
import { RotatingLines } from "react-loader-spinner";
import {
  get_items,
  add_item,
  get_total,
  get_item_total,
} from "../../redux/actions/cart";

import { useEffect, useState } from "react";
import ImageGallery from "../../components/product/ImageGallery";
import WishlistHeart from "../../components/product/WishlistHeart";

import ProductsList from "../../components/home/ProductsList";

const ProductDetail = ({
  get_product,
  get_related_products,
  related_products,
  product,
  get_items,
  add_item,
  get_total,
  get_item_total,
  add_wishlist_item,
  get_wishlist_items,
  get_wishlist_item_total,
  isAuthenticated,
  remove_wishlist_item,
  wishlist,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const params = useParams();
  const productId = params.productId;

  useEffect(() => {
    window.scrollTo(0, 0);
    get_product(productId);
    get_related_products(productId);
    get_wishlist_items();
    get_wishlist_item_total();
  }, [productId, get_product, get_related_products,get_wishlist_items, get_wishlist_item_total ]);

  const [isPresent, setIsPresent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (
        wishlist &&
        wishlist !== null &&
        wishlist !== undefined &&
        product &&
        product !== null &&
        product !== undefined
      ) {
        const productIsInWishlist = wishlist.some(
          (item) => item.product.id.toString() === product.id.toString()
        );
        setIsPresent(productIsInWishlist);
      }
    }
  }, [wishlist, isAuthenticated, product]);

  const addToCart = async () => {
    if (
      product &&
      product !== null &&
      product !== undefined &&
      product.quantity > 0
    ) {
      setLoading(true);
      await add_item(product);
      await get_items();
      await get_total();
      await get_item_total();
      setLoading(false);
      navigate("/cart");
    }
  };

  const addToWishlist = async () => {
    if (isPresent) {
      await remove_wishlist_item(product.id);
      await get_wishlist_items();
      await get_wishlist_item_total();
    } else {
      // await remove_wishlist_item(product.id);
      await add_wishlist_item(product.id);
      await get_wishlist_items();
      await get_wishlist_item_total();
      await get_items();
      await get_total();
      await get_item_total();
    }
  };

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            <ImageGallery photo={product && product.photo} />

            {/* Product info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product && product.name}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl text-gray-900">
                  $ {product && product.price}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="text-base text-gray-700 space-y-6" />
                {product && product.description}
              </div>

              <div className="mt-6">
                <p className="mt-4">
                  {product &&
                  product !== null &&
                  product !== undefined &&
                  product.quantity > 0 ? (
                    <span className="text-green-500">In Stock</span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </p>

                <div className="mt-4 flex sm:flex-col1">
                  {loading ? (
                    <RotatingLines
                      className="text-center"
                      strokeColor="grey"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="40"
                      visible={true}
                    />
                  ) : (
                    <>
                      <button
                        onClick={addToCart}
                        className="max-w-xs flex-1 bg-zinc-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-zinc-500 sm:w-full"
                      >
                        Add to Cart
                      </button>

                      <WishlistHeart
                        product={product}
                        wishlist={wishlist}
                        addToWishlist={addToWishlist}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {related_products &&
            related_products !== null &&
            related_products !== undefined && (
              <ProductsList
                data={related_products}
                title={"Related products"}
              />
            )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  product: state.Products.product,
  wishlist: state.Wishlist.items,
  related_products: state.Products.related_products,
});

export default connect(mapStateToProps, {
  get_product,
  get_related_products,
  get_items,
  add_item,
  get_total,
  get_item_total,
  add_wishlist_item,
  get_wishlist_items,
  get_wishlist_item_total,
  remove_wishlist_item,
})(ProductDetail);
