import { createContext } from "react";
import { encodeToBase64 } from "@/core/utils/TextUtils";
import content from "@/content/dist/siteProps.json";

export const SitePropsContext = createContext(null);
export function SitePropsProvider({ children }) {
        /**
         * Instead of modifying the original content object in the useEffect, consider creating a 
         * copy of content and modifying that instead. This ensures that you're not repeatedly 
         * modifying the same cached object each time the useEffect runs.
         */
        const contentDeepCopy = JSON.parse(JSON.stringify(content)); // Create a deep copy of content
        /**
         * By creating a copy of content before modifying it, you ensure that each render of the
         * SitePropsProvider component modifies a fresh copy of the content rather than repeatedly
         * modifying the same cached object.
         */
        contentDeepCopy?.socialMediaLinks.map((link) => {
            if (link.isEncoded) {
                link.href = encodeToBase64(link.href);
            }
            return link.href;
        });

    return <SitePropsContext.Provider value={contentDeepCopy}>{children}</SitePropsContext.Provider>;
}

