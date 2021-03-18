import React from "react";

import "./custom-button.scss";

const CustomButton = ({ children, handleButtonClick }) => {
	return (
		<button className="custom-button" onClick={handleButtonClick}>
			{children}
		</button>
	);
};

export default CustomButton;
