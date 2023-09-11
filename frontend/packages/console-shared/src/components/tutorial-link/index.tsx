import * as React from 'react';
import { Label } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

type GuideLinksType = { id: string; url: string }[];

type TutorialLinkProps = {
  id: string;
  type?: 'sections' | 'pages';
  icon?: React.ReactNode;
  color?: 'blue' | 'grey';
  isCompact?: boolean;
};

const TutorialLink: React.FC<TutorialLinkProps> = ({
  id,
  type = 'sections',
  isCompact,
  color = 'blue',
  icon,
}) => {
  const { t } = useTranslation();

  const handleLink = (e) => {
    e.preventDefault();
    // Prevents event from bubbling up to parent
    e.stopPropagation();
    const { href } = e.target;
    window.open(href, '_blank');
  };

  const [guideLinks, setGuideLinks] = React.useState<GuideLinksType | null>(null);

  const getTutorialUrls = (idTutorial: string): string | null => {
    if (guideLinks) {
      const resultItem = guideLinks.find((url) => url.id === idTutorial);
      return resultItem ? resultItem.url : null;
    }
    return null;
  };

  React.useEffect(() => {
    try {
      const { tutorialUrls } = window.SERVER_FLAGS;
      const tutorialUrlsParser = JSON.parse(tutorialUrls);

      const mapping = {
        sections: tutorialUrlsParser.sections,
        pages: tutorialUrlsParser.pages,
      };

      if (mapping[type]) {
        setGuideLinks(mapping[type]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse tutorial URLs', error);
    }
  }, [type]);

  const url = getTutorialUrls(`${id}`);
  if (!url) return null;

  return (
    <Label
      id={`${id}`}
      isCompact={isCompact}
      href={url}
      onClick={handleLink}
      className="pf-c-label-md"
      color={color}
      icon={icon}
    >
      {t('public~Cloud Doc')}
    </Label>
  );
};

export default TutorialLink;
