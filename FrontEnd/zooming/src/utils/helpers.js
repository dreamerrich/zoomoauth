import { DateTime } from "luxon";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const dateFormat = (date, format) => {
  return DateTime.fromISO(date).toFormat(format);
};

export const humanDate = (date) => {
  return dateFormat(date, "yyyy-MM-dd HH:mm a");
};

export const useQuery = () => {
  const { search } = useLocation();
  return search
    ? JSON.parse(
        '{"' +
          decodeURI(search.substring(1))
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
    : {};
};

export const getNested = (obj, path) => {
  const args = path.split(".");
  return args.reduce((obj, level) => obj && obj[level], obj);
};

export const useStyles = (stylePath) => {
  useEffect(() => {
   
    const head = document.head;
    const link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = stylePath;

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, [stylePath]);

  return stylePath;
};