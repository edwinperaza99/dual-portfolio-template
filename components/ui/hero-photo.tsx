"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ImageData } from "@/lib/types";

type Props = {
	image: ImageData;
	variant?: "primary" | "secondary";
};

export default function HeroPhoto({ image, variant = "primary" }: Props) {
	const isPrimary = variant === "primary";

	const glowColor = isPrimary
		? "rgba(93, 188, 252, 0.5)"
		: "rgba(244, 114, 182, 0.5)";

	const borderColor = isPrimary ? "border-blue-400" : "border-pink-400";

	const [isHovered, setIsHovered] = useState(false);

	const getWaveTransition = (delay: number) => ({
		duration: isHovered ? 1.4 : 3,
		delay,
		ease: "easeOut" as const,
		repeat: Infinity,
		repeatType: "loop" as const,
	});

	const getWaveOpacity = () => (isHovered ? 0.35 : 0.2);
	const getWaveScale = () => (isHovered ? 1.5 : 1.2);

	return (
		<div
			className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<motion.div
				className="absolute inset-0 rounded-full"
				initial={false}
				animate={{
					scale: [0.95, 1.05, 0.95],
					opacity: [0.4, 0.7, 0.4],
					boxShadow: `0 0 ${isHovered ? "35px" : "25px"} ${isHovered ? "12px" : "8px"} ${glowColor}`,
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				style={{
					filter: "blur(4px)",
				}}
			/>

			{[0, 1, 2].map((index) => (
				<motion.div
					key={index}
					className="absolute inset-0 rounded-full border"
					initial={{ scale: 1, opacity: getWaveOpacity() }}
					animate={{ scale: getWaveScale(), opacity: 0 }}
					transition={getWaveTransition(index * 0.4)}
					style={{
						borderColor: glowColor,
						filter: "blur(0.5px)",
					}}
				/>
			))}

			<div
				className={`relative w-full h-full rounded-full overflow-hidden border-[3px] ${borderColor} z-10`}
			>
				<Image
					src={image.asset.url}
					alt="Profile Picture"
					fill
					className="object-cover"
					priority
				/>
			</div>
		</div>
	);
}
