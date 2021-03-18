import React from "react";
import { connect } from "react-redux";

import "./header.scss";

const Header = ({ username, resetGame }) => {
	const handleTitleClick = () => {
		resetGame();
	};

	return (
		<div className="header">
			<div className="wrapper">
				<p className="title" onClick={handleTitleClick}>
					touch counter
				</p>
				<p className="username">{username}</p>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		username: state.options.username,
	};
};

export default connect(mapStateToProps)(Header);
