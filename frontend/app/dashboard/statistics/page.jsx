// // 'use client';

// // import { useEffect, useState } from 'react';
// // import {
// //   LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
// // } from 'recharts';

// // export default function StatisticsPage() {
// //   const [data, setData] = useState([]);
// //   const [videoTitles, setVideoTitles] = useState([]);

// //   useEffect(() => {
// //     fetch('/api/all-video-stats')
// //       .then(res => res.json())
// //       .then(result => {
// //         const merged = {};
// //         const titles = [];

// //         result.forEach(video => {
// //           titles.push({ id: video.videoId, title: video.title });

// //           video.stats.forEach(stat => {
// //             const key = stat.date;
// //             if (!merged[key]) merged[key] = { date: key };
// //             merged[key][video.title] = stat.views; // 👈 Có thể đổi sang likes hoặc minutes
// //           });
// //         });

// //         setVideoTitles(titles);
// //         setData(Object.values(merged).sort((a, b) => a.date.localeCompare(b.date)));
// //       });
// //   }, []);

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-2xl font-bold mb-6">📈 Thống kê lượt xem video theo ngày</h1>
// //       <ResponsiveContainer width="100%" height={500}>
// //         <LineChart data={data}>
// //           <XAxis dataKey="date" />
// //           <YAxis />
// //           <Tooltip />
// //           <Legend />
// //           {videoTitles.map((v, index) => (
// //             <Line
// //               key={v.id}
// //               type="monotone"
// //               dataKey={v.title}
// //               stroke={`hsl(${index * 60}, 70%, 50%)`}
// //               strokeWidth={2}
// //               dot={false}
// //             />
// //           ))}
// //         </LineChart>
// //       </ResponsiveContainer>
// //     </div>
// //   );
// // }

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';

// export default function StatisticsPage() {
//   const [chartData, setChartData] = useState(null);
//   const [videoTitles, setVideoTitles] = useState([]);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await fetch('/api/all-video-stats');
//         const result = await res.json();

//         console.log('📦 result from API:', result); // ✅ kiểm tra data

//         // ⚠️ Nếu result không phải mảng, thì không vẽ gì cả
//         if (!Array.isArray(result) || result.length === 0) {
//           setChartData(null);
//           setVideoTitles([]);
//           return;
//         }

//         const labelsSet = new Set();
//         const dataMap = {};
//         const titles = [];

//         result.forEach((video) => {
//           titles.push({ id: video.videoId, title: video.title });
//           dataMap[video.videoId] = [];

//           video.stats.forEach((stat) => {
//             labelsSet.add(stat.date);
//             dataMap[video.videoId].push(stat.views);
//           });
//         });

//         const labels = Array.from(labelsSet).sort(); // sort theo ngày
//         const datasets = titles.map((video) => ({
//           label: video.title,
//           data: dataMap[video.id],
//           backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
//         }));

//         setChartData({ labels, datasets });
//         setVideoTitles(titles);
//       } catch (error) {
//         console.error('⚠️ Error fetching stats:', error);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">📊 Thống kê hiệu suất video</h1>

//       {chartData ? (
//         <Bar data={chartData} />
//       ) : (
//         <p className="text-gray-600">Hiện chưa có dữ liệu thống kê video nào.</p>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function StatisticsPage() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const videoId = 'Nb3R54mjP-M'; // Video ID từ YouTube URL

    fetch(`/api/statistics/video/${videoId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.stats) {
          setChartData({
            labels: ['Views', 'Likes', 'Comments'],
            datasets: [
              {
                label: data.title,
                data: [
                  data.stats.views,
                  data.stats.likes,
                  data.stats.comments
                ],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
              },
            ],
          });
        }
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Thống kê Video YouTube</h2>
      {chartData ? (
        <Bar data={chartData} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
