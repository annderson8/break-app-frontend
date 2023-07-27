import { useState, useEffect } from "react";
import { connect } from "react-redux";

import Layout from "../components/hocs/Layout";
import { get_products } from "../redux/actions/products";
import { get_wishlist_items } from "../redux/actions/wishlist";

import ProductsList from "../components/home/ProductsList";

const Home = ({
  get_products,
  products,
  get_wishlist_items,
  wishlist,
  isAuthenticated,
}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchByTitle, setSearchByTitle] = useState("");
  const [wishProduct, setWishProduct] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    get_products();
    
  }, [get_products]);

  useEffect(() => {
    if (products) {
      setItems(products);
    }
  }, [products]);

  useEffect(() => {
    if (isAuthenticated) {
      get_wishlist_items();
    }
  }, [isAuthenticated, get_wishlist_items]);
  
  useEffect(() => {
    if (wishlist) {
      setWishProduct(wishlist.map((item) => item.product));
    }
  }, [wishlist]);


  const filteredItemsByTitle = (items, searchByTitle) => {
    return items?.filter((item) =>
      item.name.toLowerCase().includes(searchByTitle.toLowerCase())
    );
  };

  useEffect(() => {
    if (products !== null) {
      if (searchByTitle.length > 0) {
        setFilteredItems(filteredItemsByTitle(items, searchByTitle));
        setIsSearch(true);
      } else {
        setFilteredItems(items);
        setIsSearch(false);
      }
    }
  }, [items, searchByTitle, products]);

  return (
    <Layout>
      <div className="text-zinc-700">
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search a product"
            className="rounded-lg border border-zinc-500 w-3/4  p-4 mb-4 focus:outline-none"
            onChange={(event) => setSearchByTitle(event.target.value)}
          />
        </div>
        {!isSearch && wishProduct.length > 0 && (
          <ProductsList data={wishProduct} title={"My favourites"} />
        )}

        {filteredItems && (
          <ProductsList data={filteredItems} title={"All products"} />
        )}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  products: state.Products.products,
  wishlist: state.Wishlist.items,
});

export default connect(mapStateToProps, {
  get_products,
  get_wishlist_items,
})(Home);
