// src/Components/StarRating/StarRating.js

import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const StarRating = ({ rating }) => {
  // If rating is not provided or undefined, default to 0
  const actualRating = rating || 0;

  return (
    <Stack spacing={1}>
      <Rating className="rating" name="half-rating-read" value={actualRating} precision={0.1} />
    </Stack>
  );
};

export default StarRating;
