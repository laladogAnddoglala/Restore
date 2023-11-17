import ProductList from "./ProductList";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { productSelectors } from "./catalogSlice";

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll); // Get products from catalog state
    const {productsLoaded} = useAppSelector(state => state.catalog); // Still from catalog state
    const dispatch = useAppDispatch();

    useEffect(() => {
        
    }, [])

    if (Loading) return <LoadingComponent message="loading products..."/>

    return (
        <>
            <ProductList products={products} />
        </>
    );
}