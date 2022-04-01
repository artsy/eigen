package net.artsy.app;

import com.google.gson.annotations.SerializedName;

public class Images {
    public class ImageURLs {
        @SerializedName("square")
        public String squareImageURL;
    }

    @SerializedName("image_urls")
    public ImageURLs imageURLs;
}
