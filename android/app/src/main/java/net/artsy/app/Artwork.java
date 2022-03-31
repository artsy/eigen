package net.artsy.app;

import com.google.gson.annotations.SerializedName;
import android.widget.ImageView;

import java.util.List;

public class Artwork {
    @SerializedName("id")
    public String id;

    @SerializedName("title")
    public String title;

    @SerializedName("artist")
    public Artist artist;

    @SerializedName("artworkImages")
    public List<ArtworkImage> artworkImages;

    public ImageView image;

    public String getImageURL() {
        return "https://www.artsy.net/artwork/" + id;
    }
}
