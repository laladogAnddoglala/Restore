import ProductList from "./ProductList";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll); // Get products from catalog state
    const {productsLoaded, status} = useAppSelector(state => state.catalog); // Still from catalog state
    const dispatch = useAppDispatch();

    useEffect(() => {
       if (!productsLoaded) dispatch(fetchProductsAsync()); // Fetch products
    }, [productsLoaded, dispatch])

    if (status.includes('pending')) return <LoadingComponent message="loading products..."/>

    return (
        <>
            <ProductList products={products} />
        </>
    );
}