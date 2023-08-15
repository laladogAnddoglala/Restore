import { Button } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";
import agent from "../../app/api/agent";

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        agent.Catalog.list().then(products => setProducts(products))
    }, [])

    return (
        <>
            <ProductList products={products} />
        </>
    );
}