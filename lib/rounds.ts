import type { Listing } from "./domain";
export const WEEK = 7 * 86400000;
const monday = Date.UTC(1970, 0, 5);
export const startOfRound = (time = Date.now()) => monday + Math.floor((time - monday) / WEEK) * WEEK;
export const nextRound = (time = Date.now()) => new Date(startOfRound(time) + WEEK).toISOString();
export const isLive = (item: Listing, now = Date.now()) => item.status === "published" && Date.parse(item.publishedAt ?? "") <= now;
export const canVote = (item: Listing, now = Date.now()) => isLive(item, now) && Date.parse(item.publishedAt ?? "") >= startOfRound(now);