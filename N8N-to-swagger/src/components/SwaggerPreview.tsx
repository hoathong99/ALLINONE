import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerPreviewProps {
  spec: string;
}

const SwaggerPreview: React.FC<SwaggerPreviewProps> = ({ spec }) => {
  let specObject;
  try {
    specObject = JSON.parse(spec);
  } catch (error) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Invalid Swagger specification</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white dark:bg-gray-900">
      <SwaggerUI spec={specObject} />
    </div>
  );
};

export default SwaggerPreview;