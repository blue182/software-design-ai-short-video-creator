"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function VideoStatsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/yt-stats")
      .then((res) => res.json())
      .then((res) => setData(res.stats || []));
  }, []);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="title" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#8884d8" name="Views" />
          <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';

// export default function StatisticsPage() {
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     const videoId = 'Nb3R54mjP-M'; // Video ID từ YouTube URL

//     fetch(`/api/statistics/video/${videoId}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data && data.stats) {
//           setChartData({
//             labels: ['Views', 'Likes', 'Comments'],
//             datasets: [
//               {
//                 label: data.title,
//                 data: [
//                   data.stats.views,
//                   data.stats.likes,
//                   data.stats.comments
//                 ],
//                 backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
//               },
//             ],
//           });
//         }
//       });
//   }, []);

//   return (
//     <div className="p-4">
//       <div className="flex sm:items-center justify-between gap-4 mb-6 border-b border-primary-300 pb-4">

//         <h2 className="font-bold text-xl sm:text-xl md:text-2xl lg:text-3xl text-primary">Youtube data statistics</h2>
//       </div>
//       {chartData ? (
//         <Bar data={chartData} />
//       ) : (
//         <p>Loading data...</p>
//       )}
//     </div>
//   );
// }
