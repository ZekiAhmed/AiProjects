    // Fetching data on CLIENT


// "use client"

// import { useTRPC } from "@/trpc/client"
// import { useQueries, useQuery } from "@tanstack/react-query";

// const page = () => {
  //   const trpc = useTRPC();
  //   const {data} = useQuery(trpc.hello.queryOptions({text:"zeki"}))
  //   return (
    //     <div>
    //       {/* {data?.greeting} */}
    //       {JSON.stringify(data)}
    //     </div>
    //   )
    // }
    
    // export default page
    
    
//===================================================================
    
    // Fetching data on server


// const page = async () => {
// const data = await caller.hello({text:'zeki'})
//     return (
//         <div>
//           {/* {data?.greeting} */}
//           {JSON.stringify(data)}
//         </div>
//       )
//     }
    
//     export default page



//=================================================================

    // Fetching data on the SERVER then to use it on CLIENT

import { caller, getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Test from "./components/Test";

const page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({text:"zeki"}))
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<p>Loading...</p>}>
            <Test/>
          </Suspense>
        </HydrationBoundary>
      )
    }
    
    export default page
    