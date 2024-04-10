const IFrameRender = ({ src }: { src: string }) => {
  return (
    <iframe
      src={src}
      className="w-full  h-screen"
      loading="lazy"
      allowFullScreen={true}
      allowTransparency={true}
    ></iframe>
  );
};

export default IFrameRender;
