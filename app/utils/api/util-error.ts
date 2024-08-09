import { NextResponse } from "next/server";

export const nextResponseApiError = (
  message: string,
  err: unknown,
  status: number
) => {
  const baseMessage = `🔥 🔥 🔥 🔥 🔥  Oops !!! :   ${message}`;

  let errorMessage: string;

  if (err instanceof Error) {
    // console.error(`${baseMessage}\n`, err.message, `\nStack : `, err.stack);
    errorMessage = `${baseMessage}\n${err.message} \nStack : ${err.stack}`;
  } else if (typeof err === "string") {
    // console.error(`${baseMessage}\n `, err);
    errorMessage = `${baseMessage}\n ${err}`;
  } else if (typeof err === "object" && err !== null) {
    // console.error(`${baseMessage}\n`, JSON.stringify(err, null, 2));
    (errorMessage = `${baseMessage}\n `), JSON.stringify(err, null, 2);
  } else {
    // console.error(`${baseMessage}\n`, err);
    (errorMessage = `${baseMessage}\n`), err;
  }

  return new NextResponse(baseMessage + "\n" + errorMessage, {
    status: status,
  });
};
