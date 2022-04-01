package net.artsy.app;

import com.google.gson.annotations.SerializedName;
import android.widget.ImageView;

public class Artwork {
    @SerializedName("id")
    public String id;

    @SerializedName("title")
    public String title;

    @SerializedName("artist")
    public Artist artist;

    @SerializedName("images")
    public Images[] images;

    public ImageView image;

    public String getImageURL() {
        return "https://www.artsy.net/artwork/" + id;
    }
}
