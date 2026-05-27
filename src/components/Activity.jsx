import axios from 'axios';
import React,{useState, useEffect} from 'react'

const Activity = ()=>{
const[activity, setActivity] = useState([]);
useEffect(()=>{
    const getData = async()=>{
        const res = await axios.get("api/activity")
        setActivity(res.data.activity)
        console.log(res.data.activity)
    }
    getData();
},[])
return(
    <div className="bg-black border border-green-900 rounded-3xl p-6 mt-10 shadow-2xl">

  <h1 className="text-3xl font-bold text-green-400 mb-6">
    Recent Activity
  </h1>

  <div className="flex flex-col gap-4">

    {activity.map((item) => (

      <div
        key={item._id}
        className="bg-[#0f172a] border border-green-950 p-4 rounded-2xl flex justify-between items-center"
      >

        <div>
          <h1 className="text-white font-semibold">
            {item.message}
          </h1>

          <p className="text-gray-400 text-sm">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="w-3 h-3 rounded-full bg-green-500"></div>

      </div>

    ))}

  </div>

</div>
)
}
export default Activity