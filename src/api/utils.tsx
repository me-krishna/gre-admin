export const sucessResponse = (data: any, count: number) => {
  return {
    success: true,
    status: 200,
    data: data,
    meta: {
      count: count,
    },
  };
};

export const errorResponse = (error: any) => {
  return {
    success: false,
    status: error.code,
    error: {
      message: error.message,
    },
  };
};
