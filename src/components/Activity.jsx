import axios from 'axios';
import React, { useState, useEffect } from 'react'

const Activity = () => {
  const [activity, setActivity] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("api/activity")
      setActivity(res.data.activity)
    }
    getData();
  }, [])
  return (
    <div className="bg-background border border-border rounded-3xl p-6 mt-10 shadow-2xl">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Recent Activity
      </h1>

      <div className="flex flex-col gap-4">
        {activity.map((item) => (

          <div
            key={item._id}
            className="bg-background border border-boder p-4 rounded-2xl flex justify-between items-center"
          >
            <div>
              <h1 className="text-foreground font-semibold">
                {item.message}
              </h1>

              <p className="text-muted text-sm">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Activity