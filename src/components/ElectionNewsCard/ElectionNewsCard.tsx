import React, { ComponentProps, ReactNode, useCallback } from "react";
import ReactMarkdown from "react-markdown";

import { ClassNames, themable } from "../../hooks/theme";
import { ElectionNews } from "../../types/Election";
import { format, parseISO, addHours } from "date-fns";
import { DivBody, DivLabel, Heading3, makeTypographyComponent } from "../Typography/Typography";
import SVGCode4Romania from "../../assets/code4romania.svg";
import LinkCircle from "../../assets/link-circle.svg";
import TwitterLogo from "../../assets/twitter.svg";
import FacebookLogo from "../../assets/facebook.svg";
import cssClasses from "./ElectionNewsCard.module.scss";

type Props = {
  news: ElectionNews;
  onImageClick?: (src: string) => unknown;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  feedLink?: string;
};

const Heading3Link = makeTypographyComponent<ComponentProps<"a">>("a", "h3");

const Avatar = ({ classes, image, name }: { classes: ClassNames; image?: string | null; name: string }) => {
  if (image) {
    return <img className={classes.avatar} src={image} />;
  }
  return (
    <div className={classes.avatar}>
      <div className={classes.initials}>{name.substring(0, 1).toUpperCase()}</div>
    </div>
  );
};

function nodeScriptReplace(node: Node) {
  if (((node as unknown) as Element).tagName === "SCRIPT") {
    node.parentNode?.replaceChild(nodeScriptClone(node as HTMLScriptElement), node);
  } else {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      nodeScriptReplace(children[i]);
    }
  }

  return node;
}

function nodeScriptClone(node: HTMLScriptElement) {
  const script = document.createElement("script");
  script.text = node.innerHTML;

  const attrs = node.attributes;
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    script.setAttribute(attrs[i].name, attr.value);
  }
  return script;
}

const renderers = {
  // eslint-disable-next-line react/display-name
  link: (props: unknown) => <a target="_blank" rel="noreferrer noopener" {...props} />,
};

export const ElectionNewsCard = themable<Props>(
  "ElectionNewsCard",
  cssClasses,
)(({ classes, news, onImageClick, footerLeft, footerRight, feedLink }) => {
  const utcOffset = new Date().getTimezoneOffset() / 60;
  const parsedDate = parseISO(news.timestamp);
  const date = addHours(parsedDate, -utcOffset);

  const embedRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;
      el.innerHTML = news.embed || "";
      nodeScriptReplace(el); // Script tags added with innerHTML are not executed by default
    },
    [news.embed],
  );

  return (
    <div className={classes.root}>
      <div className={classes.timestampColumn}>
        <DivBody className={classes.date}>{format(date, "dd MMM")}&nbsp;</DivBody>
        <DivBody className={classes.year}>{format(date, "yyyy")}&nbsp;</DivBody>
        <DivLabel className={classes.time}>{format(date, "HH:mm")}</DivLabel>
      </div>
      <div className={classes.container}>
        {news.author && (
          <div className={classes.author}>
            <Avatar image={news.author.avatar} name={news.author.name} classes={classes} />
            <DivBody className={classes.authorName}>{news.author.name}</DivBody>
          </div>
        )}
        <div className={classes.content}>
          {news.title && !news.link && <Heading3 className={classes.title}>{news.title}</Heading3>}
          {news.title && news.link && (
            <Heading3Link className={classes.title} href={news.link} target="_blank" rel="noopener noreferrer">
              {news.title}
            </Heading3Link>
          )}
          {news.body && (
            <DivBody className={classes.body}>
              <ReactMarkdown renderers={renderers}>{news.body}</ReactMarkdown>
            </DivBody>
          )}
          {news.link && (
            <div className={classes.footer}>
              <span>Link: </span>
              <a className={classes.footerLink} href={news.link} target="_blank" rel="noopener noreferrer">
                <LinkCircle width="25" height="25" className={classes.footerLinkIcon} />
              </a>
            </div>
          )}
          {news.images && news.images?.length > 0 && (
            <div className={classes.pictures}>
              {news.images.map((picture, index) => {
                const src = picture.url;
                if (!src) return null;
                return (
                  <img
                    key={index}
                    className={classes.picture}
                    style={{ cursor: onImageClick ? "pointer" : undefined }}
                    src={src}
                    onClick={() => {
                      if (onImageClick) onImageClick(src);
                    }}
                  />
                );
              })}
            </div>
          )}
          {news.embed && <div className={classes.embed} ref={embedRef} />}
        </div>
        <hr className={classes.hLine} />
        <div className={classes.footer}>
          {feedLink && (
            <>
              <span>Share on: </span>
              <a
                className={classes.footerLink}
                href={`https://twitter.com/intent/tweet?url=${feedLink}&text=${news.body}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterLogo width="25" height="25" className={classes.footerLinkIcon} />
              </a>
              <a
                className={classes.footerLink}
                href={`https://www.facebook.com/sharer/sharer.php?u=${feedLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookLogo width="25" height="25" className={classes.footerLinkIcon} />
              </a>
            </>
          )}
          {footerLeft}
          <div className={classes.separator} />
          {footerRight}
          <a href="https://code4.ro" target="_blank" rel="noopener noreferrer">
            <SVGCode4Romania height="25" className={classes.logo} />
          </a>
        </div>
      </div>
    </div>
  );
});
