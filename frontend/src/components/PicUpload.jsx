import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const PictureForm = () => {
  const { user } = useAuthContext();
  const email = user.email;
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImg = async (timestamp, signature) => {
    const folder = 'images';

    const data = new FormData();
    data.append('file', img);
    data.append('timestamp', timestamp);
    data.append('signature', signature);
    data.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    data.append('folder', folder);

    try {
      let cloudname = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      let resourceType = "image";
      let api = `https://api.cloudinary.com/v1_1/${cloudname}/${resourceType}/upload`;

      const res = await fetch(api, {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      console.log(result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw error;
    }
  }

  const getSignatureForUpload = async (folder) => {
    try {
      const res = await fetch('http://localhost:4000/api/user/generateSignature', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({folder})
      })

      const result = await res.json();
      return result; // ✅ Already parsed object
    } catch (error) {
      console.error("Signature fetch failed:", error);
      throw error;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { timestamp, signature } = await getSignatureForUpload('images');

      const imgUrl = await uploadImg(timestamp, signature);

      const response = await fetch('http://localhost:4000/api/user/upload-profilePic', {
        method: 'POST',
        body: JSON.stringify({ email, imgUrl }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (!response.ok) {
        setLoading(false);
      }
      
      if (response.ok) {
        setLoading(false);
        setImg(null);
        console.log('Picture upload successful');
      }

    } catch (error) {
      console.error(error);
    }
  }

  // return (
  //   <>
  //     <form onSubmit={handleSubmit}>
  //       <label htmlFor="picture">Picture:</label>
  //       <input 
  //         type="file" 
  //         accept="image/*"
  //         id="picture" 
  //         onChange={(e) => setImg((prev) => e.target.files[0])}
  //       />
  //       <button type="submit" disabled={loading}>
  //         {loading ? "Uploading..." : "Upload"}
  //       </button>
  //     </form>
  //   </>
  // );
}
 
export default PictureForm;