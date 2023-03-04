export interface SuccessResponseDto {
  isSuccess: boolean;
}

export const successfulResponse = (): SuccessResponseDto => ({
  isSuccess: true,
});
