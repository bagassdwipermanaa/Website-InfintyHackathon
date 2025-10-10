-- Add original_artwork_id column to artworks table
-- This column will track the original artwork ID for purchased artworks

ALTER TABLE artworks 
ADD COLUMN original_artwork_id INT NULL,
ADD INDEX idx_original_artwork_id (original_artwork_id),
ADD FOREIGN KEY (original_artwork_id) REFERENCES artworks(id) ON DELETE SET NULL;
