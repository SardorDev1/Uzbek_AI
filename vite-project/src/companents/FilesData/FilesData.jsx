import React, { useEffect, useState } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export default function FilesData() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const imagesListRef = ref(storage);

  useEffect(() => {
    listAll(MusicListRef)
      .then((response) => {
        // Barcha fayllar uchun URL lar to'plamini saqlash uchun ro'yxat
        const urls = response.items.map((item) => {
          return getDownloadURL(item)
            .then((url) => {
              return url;
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
              return null;
            });
        });

        // Hamma URL lar ishlangandan keyin state ni yangilash
        Promise.all(urls)
          .then((downloadUrls) => {
            setMusicUrls(downloadUrls.filter((url) => url !== null));
          })
          .catch((error) => {
            console.error('Error getting download URLs:', error);
          });
      })
      .catch((error) => {
        console.error('Error listing files:', error);
      });
  }, []);

  return (
    <div>

      <ul>

      </ul>
    </div>
  );
}
