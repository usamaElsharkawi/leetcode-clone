import {gerProblemById} from "@/lib/data/problems"
import {useState,useEffect} from 'react'
export const useProblem = (id:string) => {
   
    const [problem,setProblem] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try{
            setIsLoading(true);
            const result = await gerProblemById(id);
            if (result.success) {
                setProblem(result.data);
            }
        }catch(err){
            console.error(err);
        }  
        finally{
            setIsLoading(false);
        }
    } 
    fetchData();
    }, [id]);
    

    return {
        problem,
        setProblem,
        isLoading
    }
}   
