export const getBestImage = (images)=> 
     images.reduce((best, img) => {
      const bestResolution = best.width * best.height;
      const imgResolution = img.width * img.height;
      return imgResolution > bestResolution ? img : best;
    }, images[0]).url;
  