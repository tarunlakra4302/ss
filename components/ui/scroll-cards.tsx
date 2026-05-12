"use client";
import {FC} from "react";

import Image from "next/image";

// Types
interface iCardItem {
	title: string;
	description: string;
	tag: string;
	src: string;
	link: string;
	color: string;
	textColor: string;
}

interface iCardProps extends Omit<iCardItem, "src" | "link" | "tag"> {
	i: number;
	src: string;
	stickyOffset?: string;
}

// Components
const Card: FC<iCardProps> = ({
	title,
	description,
	color,
	textColor,
	i,
	src,
	stickyOffset,
}) => {
	return (
		<div 
			className="h-screen flex items-start md:items-center justify-center sticky md:p-0 px-4 pt-[2vh] md:pt-0"
			style={{ top: stickyOffset || "0px" }}
		>
			<div
				className="relative flex flex-col h-[300px] w-[700px] py-12 px-10 md:px-12
				rotate-0 md:h-[400px] md:w-[600px] items-center justify-center mx-auto 
				shadow-md pr-3 pl-3 pt-3 pb-4 overflow-hidden rounded-2xl"
				style={{backgroundColor: color}}
			>
				<span className="font-bold relative text-5xl md:text-7xl mt-5 z-10">
					<span
						className="relative z-10 font-black tracking-tight"
						style={{color: textColor}}
					>
						{title}
					</span>
				</span>
				<div
					className="text-lg md:text-2xl font-medium text-center mb-0 z-10 mt-2 lowercase tracking-wide"
					style={{lineHeight: 1.4, color: textColor}}
				>
					{description}
				</div>
				<div className="absolute inset-0 z-0">
					<Image
						className="w-full h-full object-cover"
						src={src}
						alt="Background"
						fill
					/>
                    <div className="absolute inset-0 bg-black/40" />
				</div>
			</div>
		</div>
	);
};

/**
 * CardSlide component displays a series of cards in a vertical scroll layout
 * Each card contains a title, description, and decorative elements
 */
interface iCardSlideProps {
	items: iCardItem[];
	stickyOffset?: string;
}

const CardsParallax: FC<iCardSlideProps> = ({items, stickyOffset}) => {
	return (
		<div className="min-h-screen">
			{items.map((project, i) => {
				return <Card key={`p_${i}`} {...project} i={i} stickyOffset={stickyOffset} />;
			})}
		</div>
	);
};

export {CardsParallax, type iCardItem};
