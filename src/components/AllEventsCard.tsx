import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { type Events } from "@prisma/client";
import UpdateEvent from "./UpdateEvent";
import { Button } from "./ui/button";

interface Props {
  events: Events[];
}

const AllEventsCard = (props: Props) => {
  const { events } = props;

  console.log(events);

  return (
    <>
      <Card>
        {/* <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader> */}
        <CardContent className="bg-ternary text-primary">
          <Accordion type="single" collapsible className="w-full">
            {events.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="capitalize">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2">
                    <span>
                      Yes. It adheres to the WAI-ARIA design pattern.{" "}
                      {item.description}
                    </span>
                    <span className="capitalize">
                      {item.location}:{" "}
                      {item.startDate.toString().split("GMT")[0]}
                      {" - "}
                      {item.endDate.toString().split("GMT")[0]}
                    </span>
                    <div className="flex gap-2">
                      <UpdateEvent event={item} />
                      <Button variant="outline" className="w-fit">
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                {`Yes. It comes with default styles that matches the other
                components' aesthetic.`}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                {`  Yes. It's animated by default, but you can disable it if you
                prefer.`}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};

export default AllEventsCard;
