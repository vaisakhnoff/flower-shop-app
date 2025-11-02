import { collection, getDocs } from "firebase/firestore";
import { useState , useEffect} from "react";
import { db } from "../firebase";
import type { Category } from "../types";


export function useCategories(){

    const [categories,setCategories] = useState<Category[]>([])
    const [isLoading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);


    useEffect(()=>{
        const fetchCategories = async()=>{
            setLoading(true);
            try {
                const categoriesCollection = collection(db,'categories');
                const querySnapShot = await getDocs(categoriesCollection);

                const categoriesData =  querySnapShot.docs.map(doc =>({
                    id : doc.id,
                    ...doc.data()
                }as Category));

                setCategories(categoriesData);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch categories")
            }
            setLoading(false)
        };

        fetchCategories();
    },[]);

    return {categories,isLoading,error}



}